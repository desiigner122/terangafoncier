import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  DollarSign, 
  Eye, 
  TrendingUp,
  Users,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Camera,
  Edit,
  Shield,
  Brain,
  Zap,
  Target,
  Lightbulb,
  BarChart3,
  PieChart,
  Star,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';

const VendeurOverview = ({ stats }) => {
  const navigate = useNavigate();
  const [aiInsights] = useState([]);

  const [recentProperties] = useState([]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getAIScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-full bg-purple-50">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats?.totalProperties || 0}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Propriétés totales
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-full bg-green-50">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats?.monthlyRevenue || 0)}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Revenus mensuels
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-full bg-purple-50">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <Badge className="bg-purple-100 text-purple-800">
                  IA Active
                </Badge>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats?.aiOptimized || 0}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Biens optimisés IA
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-full bg-blue-50">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  Vérifié
                </Badge>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats?.blockchainVerified || 0}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Biens certifiés blockchain
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions Rapides et Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions Rapides IA */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-purple-600" />
              Actions IA Rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Brain className="h-4 w-4 mr-2" />
              Listing IA Optimisé
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Analyse Photos IA
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Optimisation Prix
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Prédictions Marché
            </Button>
          </CardContent>
        </Card>

        {/* Actions Blockchain */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Actions Blockchain
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Vérifier Propriétés
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Smart Contracts
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Historique Blockchain
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Star className="h-4 w-4 mr-2" />
              Créer NFT Propriété
            </Button>
          </CardContent>
        </Card>

        {/* Widget IA Assistant */}
        <AIAssistantWidget />
      </div>

      {/* Insights IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Recommandations IA
          </CardTitle>
          <CardDescription>
            Insights intelligents pour optimiser vos ventes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Alert className={`${
                insight.priority === 'high' ? 'border-red-200 bg-red-50' :
                insight.priority === 'medium' ? 'border-orange-200 bg-orange-50' :
                'border-green-200 bg-green-50'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    insight.type === 'opportunity' ? 'bg-green-100 text-green-600' :
                    insight.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {insight.type === 'opportunity' ? <TrendingUp className="h-4 w-4" /> :
                     insight.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                     <CheckCircle className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <AlertTitle className="text-sm font-semibold">
                      {insight.title}
                    </AlertTitle>
                    <AlertDescription className="text-sm mt-2">
                      {insight.description}
                    </AlertDescription>
                    {insight.impact && (
                      <p className="text-sm font-medium text-green-600 mt-2">
                        💡 Impact: {insight.impact}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" className="text-xs">
                        {insight.action}
                      </Button>
                      <Badge variant="outline" className="text-xs">
                        {insight.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Alert>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Propriétés Récentes */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Propriétés Récentes
              <Badge className="bg-purple-100 text-purple-800 text-xs">
                IA Optimisé
              </Badge>
            </CardTitle>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate('/dashboard/add-parcel')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter Bien
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProperties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {property.title}
                      </h3>
                      <Badge className={getAIScoreColor(property.aiScore)}>
                        <Brain className="h-3 w-3 mr-1" />
                        Score IA: {property.aiScore}
                      </Badge>
                      {property.blockchainVerified && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium text-gray-900">Prix</p>
                        <p>{formatCurrency(property.price)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Localisation</p>
                        <p className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {property.location}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Taille</p>
                        <p>{property.size}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Vues</p>
                        <p className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {property.views}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Widget Blockchain */}
      <BlockchainWidget />
    </div>
  );
};

export default VendeurOverview;
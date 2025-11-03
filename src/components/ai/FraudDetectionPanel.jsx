/**
 * @file FraudDetectionPanel.jsx
 * @description Panneau détection fraude pour notaires/admins
 * @created 2025-11-03
 * @week 3 - Day 1-5
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, AlertTriangle, Activity, TrendingDown, TrendingUp, 
  FileWarning, Users, CreditCard, Network, Sparkles, Loader2,
  CheckCircle2, XCircle, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const FraudDetectionPanel = ({ caseId, caseData, onAnalysisComplete }) => {
  const { session } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fraudAnalysis, setFraudAnalysis] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Lancer analyse de fraude
  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/ai/detect-fraud`,
        { caseId },
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        }
      );

      const { fraudAnalysis } = response.data;
      setFraudAnalysis(fraudAnalysis);
      setShowDetails(true);

      if (fraudAnalysis.riskLevel === 'high' || fraudAnalysis.riskLevel === 'critical') {
        toast.error(`⚠️ Risque de fraude ${fraudAnalysis.riskLevel === 'critical' ? 'CRITIQUE' : 'ÉLEVÉ'} détecté !`);
      } else {
        toast.success(`✅ Analyse terminée - Risque ${fraudAnalysis.riskLevel}`);
      }

      if (onAnalysisComplete) {
        onAnalysisComplete(fraudAnalysis);
      }
    } catch (error) {
      console.error('Erreur analyse fraude:', error);
      toast.error('Échec analyse de fraude');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Configuration niveau de risque
  const getRiskConfig = (level) => {
    switch (level) {
      case 'low':
        return {
          label: 'Faible',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: CheckCircle2,
          description: 'Aucun indicateur de fraude significatif'
        };
      case 'medium':
        return {
          label: 'Moyen',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: Info,
          description: 'Quelques anomalies mineures détectées'
        };
      case 'high':
        return {
          label: 'Élevé',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          icon: AlertTriangle,
          description: 'Indicateurs de fraude significatifs - Vérification requise'
        };
      case 'critical':
        return {
          label: 'CRITIQUE',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: XCircle,
          description: 'Fraude probable - Bloquer la transaction immédiatement'
        };
      default:
        return {
          label: 'Non analysé',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: Shield,
          description: 'Analyse de fraude non effectuée'
        };
    }
  };

  // Icônes par catégorie de flag
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'document': return FileWarning;
      case 'identity': return Users;
      case 'transaction': return CreditCard;
      case 'behavior': return Activity;
      case 'network': return Network;
      default: return AlertTriangle;
    }
  };

  // Grouper flags par catégorie
  const groupFlagsByCategory = (flags) => {
    const grouped = {};
    flags?.forEach(flag => {
      const category = flag.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(flag);
    });
    return grouped;
  };

  const riskConfig = fraudAnalysis ? getRiskConfig(fraudAnalysis.riskLevel) : getRiskConfig(null);
  const RiskIcon = riskConfig.icon;
  const groupedFlags = fraudAnalysis ? groupFlagsByCategory(fraudAnalysis.flags) : {};

  return (
    <>
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Détection de Fraude IA</CardTitle>
              <CardDescription>
                Analyse multi-couches par Intelligence Artificielle
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-purple-50 border-purple-200">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-800 text-sm">
              <strong>L'IA Teranga analyse:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Documents (falsifications, incohérences)</li>
                <li>Identités (usurpation, doublons)</li>
                <li>Transactions (montants suspects)</li>
                <li>Comportements (patterns anormaux)</li>
                <li>Réseaux (connexions douteuses)</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Bouton analyse */}
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Lancer Détection de Fraude
              </>
            )}
          </Button>

          {/* Résumé si déjà analysé */}
          {fraudAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${riskConfig.bgColor} ${riskConfig.borderColor} border-2 rounded-lg p-4 space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Niveau de risque</span>
                <Badge className={`${riskConfig.color} font-bold`}>
                  {riskConfig.label}
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <RiskIcon className={`w-8 h-8 ${riskConfig.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Score de risque</span>
                    <span className={`text-sm font-bold ${riskConfig.color}`}>
                      {Math.round(fraudAnalysis.riskScore)}/100
                    </span>
                  </div>
                  <Progress 
                    value={fraudAnalysis.riskScore} 
                    className={`h-2 ${riskConfig.bgColor}`}
                  />
                </div>
              </div>

              {fraudAnalysis.flags && fraudAnalysis.flags.length > 0 && (
                <Alert className={`${riskConfig.bgColor} ${riskConfig.borderColor} border`}>
                  <AlertTriangle className={`h-4 w-4 ${riskConfig.color}`} />
                  <AlertDescription className={`${riskConfig.color} text-sm`}>
                    <strong>{fraudAnalysis.flags.length} alerte(s) détectée(s)</strong>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={() => setShowDetails(true)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Voir détails complets
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Dialog détails */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Rapport Détection de Fraude IA
            </DialogTitle>
            <DialogDescription>
              Analyse complète effectuée par l'Intelligence Artificielle Teranga
            </DialogDescription>
          </DialogHeader>

          {fraudAnalysis && (
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Résumé</TabsTrigger>
                <TabsTrigger value="flags">
                  Alertes ({fraudAnalysis.flags?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="recommendations">Actions</TabsTrigger>
              </TabsList>

              {/* Onglet Résumé */}
              <TabsContent value="summary" className="space-y-4">
                <Card className={`${riskConfig.bgColor} ${riskConfig.borderColor} border-2`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Niveau de risque global</p>
                        <p className={`text-3xl font-bold ${riskConfig.color}`}>
                          {riskConfig.label}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{riskConfig.description}</p>
                      </div>
                      <RiskIcon className={`w-16 h-16 ${riskConfig.color}`} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Score de risque</span>
                        <span className={`font-bold ${riskConfig.color}`}>
                          {Math.round(fraudAnalysis.riskScore)}/100
                        </span>
                      </div>
                      <Progress value={fraudAnalysis.riskScore} className="h-3" />
                    </div>
                  </CardContent>
                </Card>

                {/* Stats par catégorie */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(groupedFlags).map(([category, flags]) => {
                    const CategoryIcon = getCategoryIcon(category);
                    return (
                      <Card key={category}>
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CategoryIcon className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium capitalize">
                              {category === 'document' ? 'Documents' :
                               category === 'identity' ? 'Identités' :
                               category === 'transaction' ? 'Transactions' :
                               category === 'behavior' ? 'Comportements' :
                               category === 'network' ? 'Réseau' : 'Autres'}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-red-600">{flags.length}</p>
                          <p className="text-xs text-gray-600">alerte(s)</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Onglet Alertes */}
              <TabsContent value="flags" className="space-y-3">
                {fraudAnalysis.flags && fraudAnalysis.flags.length > 0 ? (
                  <AnimatePresence>
                    {fraudAnalysis.flags.map((flag, index) => {
                      const CategoryIcon = getCategoryIcon(flag.category);
                      const severity = flag.severity || 'medium';
                      const severityConfig = {
                        low: 'border-yellow-200 bg-yellow-50',
                        medium: 'border-orange-200 bg-orange-50',
                        high: 'border-red-200 bg-red-50',
                        critical: 'border-red-300 bg-red-100'
                      }[severity];

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`${severityConfig} border-2 rounded-lg p-4`}
                        >
                          <div className="flex items-start gap-3">
                            <CategoryIcon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {flag.category?.toUpperCase()}
                                </Badge>
                                <Badge 
                                  className={`text-xs ${
                                    severity === 'critical' ? 'bg-red-600 text-white' :
                                    severity === 'high' ? 'bg-red-500 text-white' :
                                    severity === 'medium' ? 'bg-orange-500 text-white' :
                                    'bg-yellow-500 text-white'
                                  }`}
                                >
                                  {severity.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="font-medium text-gray-900 mb-1">{flag.type}</p>
                              <p className="text-sm text-gray-700">{flag.description}</p>
                              
                              {flag.details && (
                                <details className="mt-2">
                                  <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-900">
                                    Détails techniques
                                  </summary>
                                  <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
                                    {JSON.stringify(flag.details, null, 2)}
                                  </pre>
                                </details>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                ) : (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Aucune alerte de fraude détectée. La transaction semble légitime.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              {/* Onglet Recommandations */}
              <TabsContent value="recommendations" className="space-y-4">
                {fraudAnalysis.riskLevel === 'critical' && (
                  <Alert className="bg-red-100 border-red-300 border-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong className="text-base">⛔ ACTION IMMÉDIATE REQUISE</strong>
                      <p className="mt-2">Risque de fraude CRITIQUE détecté. Bloquez cette transaction immédiatement et contactez les autorités compétentes.</p>
                    </AlertDescription>
                  </Alert>
                )}

                {fraudAnalysis.riskLevel === 'high' && (
                  <Alert className="bg-orange-100 border-orange-300 border-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      <strong className="text-base">⚠️ VÉRIFICATION APPROFONDIE</strong>
                      <p className="mt-2">Risque élevé. Effectuez une vérification manuelle approfondie avant de poursuivre.</p>
                    </AlertDescription>
                  </Alert>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Actions Recommandées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {fraudAnalysis.riskLevel === 'critical' ? (
                        <>
                          <li className="flex items-start gap-2">
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Suspendre la transaction immédiatement</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Notifier le service de conformité</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Contacter les autorités (Police, CENTIF)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Geler les fonds si déjà versés</span>
                          </li>
                        </>
                      ) : fraudAnalysis.riskLevel === 'high' ? (
                        <>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Vérifier manuellement tous les documents</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Contacter directement l'acheteur et le vendeur</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Demander des justificatifs supplémentaires</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Vérifier l'authenticité auprès des autorités compétentes</span>
                          </li>
                        </>
                      ) : fraudAnalysis.riskLevel === 'medium' ? (
                        <>
                          <li className="flex items-start gap-2">
                            <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Examiner les alertes signalées</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Demander clarifications si nécessaire</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Surveiller attentivement la transaction</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Procéder normalement avec la transaction</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">Aucune action spécifique requise</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FraudDetectionPanel;

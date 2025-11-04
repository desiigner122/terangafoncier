/**
 * @file AIValidationButton.jsx
 * @description Bouton validation documents par IA avec résultats
 * @created 2025-11-03
 * @week 3 - Day 1-5
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, CheckCircle2, XCircle, AlertTriangle, Loader2, 
  FileCheck, Shield, TrendingUp, Brain 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAIDocumentValidation } from '@/hooks/useAIDocumentValidation';

const AIValidationButton = ({ caseId, documents, onValidationComplete }) => {
  const { validateCaseDocuments, isValidating, validationResult } = useAIDocumentValidation();
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const handleValidate = async () => {
    const validationResults = await validateCaseDocuments(caseId);
    
    if (validationResults) {
      setResults(validationResults);
      setShowResults(true);
      
      if (onValidationComplete) {
        onValidationComplete(validationResults);
      }
    }
  };

  // Calculer statistiques
  const getStats = () => {
    if (!results) return null;

    const valid = results.filter(r => r.isValid).length;
    const invalid = results.filter(r => !r.isValid).length;
    const avgScore = results.reduce((sum, r) => sum + (r.confidenceScore || 0), 0) / results.length;

    return { valid, invalid, avgScore, total: results.length };
  };

  const stats = getStats();

  return (
    <>
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Validation par Intelligence Artificielle</CardTitle>
              <CardDescription>
                Analyse automatique de {documents?.length || 0} documents en quelques secondes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <strong>L'IA Teranga analyse:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Authenticité des documents d'identité</li>
                <li>Validité des titres de propriété</li>
                <li>Cohérence des informations</li>
                <li>Détection de falsifications</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleValidate}
            disabled={isValidating || !documents || documents.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Valider avec l'IA
              </>
            )}
          </Button>

          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Dernière validation</span>
                <Badge className="bg-purple-100 text-purple-800">IA Teranga v1.0</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-2xl font-bold">{stats.valid}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Valides</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-red-600">
                    <XCircle className="w-4 h-4" />
                    <span className="text-2xl font-bold">{stats.invalid}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Invalides</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-2xl font-bold">{Math.round(stats.avgScore)}%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Confiance</p>
                </div>
              </div>

              <Button
                onClick={() => setShowResults(true)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Voir détails
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Dialog résultats détaillés */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Résultats Validation IA
            </DialogTitle>
            <DialogDescription>
              Analyse détaillée de chaque document par l'Intelligence Artificielle
            </DialogDescription>
          </DialogHeader>

          {results && (
            <div className="space-y-4">
              {/* Score global */}
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Score de confiance global</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {Math.round(stats.avgScore)}%
                      </p>
                    </div>
                    <Shield className="w-12 h-12 text-purple-400" />
                  </div>
                  <Progress value={stats.avgScore} className="h-3" />
                </CardContent>
              </Card>

              {/* Liste documents */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Documents analysés</h4>
                
                <AnimatePresence>
                  {results.map((result, index) => (
                    <motion.div
                      key={result.documentId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border-2 rounded-lg p-4 ${
                        result.isValid
                          ? 'border-green-200 bg-green-50'
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {result.isValid ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                          )}
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-gray-900">
                                {result.documentType?.replace('_', ' ').toUpperCase()}
                              </p>
                              <Badge variant="outline">
                                Confiance: {Math.round(result.confidenceScore || 0)}%
                              </Badge>
                            </div>

                            {result.isValid ? (
                              <p className="text-sm text-green-700">
                                ✅ Document authentique et valide
                              </p>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-red-700">
                                  Problèmes détectés:
                                </p>
                                <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                                  {result.issues?.map((issue, i) => (
                                    <li key={i}>{issue}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Détails techniques */}
                            {result.details && (
                              <details className="mt-3">
                                <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-900">
                                  Détails techniques
                                </summary>
                                <pre className="text-xs bg-white p-2 rounded mt-2 overflow-x-auto">
                                  {JSON.stringify(result.details, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Actions */}
              {stats.invalid > 0 && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 text-sm">
                    <strong>Action requise:</strong> {stats.invalid} document(s) invalide(s) détecté(s).
                    Veuillez les remplacer ou contacter le notaire pour vérification manuelle.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIValidationButton;

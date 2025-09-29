import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Brain, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Scan, 
  Upload, 
  Eye, 
  Search, 
  Network, 
  Zap, 
  Target, 
  Activity, 
  Clock, 
  Download, 
  Share2,
  Database,
  Lock,
  Unlock,
  UserCheck,
  FileCheck,
  TrendingUp,
  Filter,
  RefreshCw,
  Archive,
  Flag,
  Award
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MairieAntiFraude = ({ dashboardStats }) => {
  const [scanningDocument, setScanningDocument] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedTab, setSelectedTab] = useState('scanner');

  // Statistiques anti-fraude
  const [fraudStats, setFraudStats] = useState({
    documentsScanned: 1247,
    fraudsDetected: 23,
    validDocuments: 1183,
    pendingVerification: 41,
    accuracyRate: 96.8,
    monthlyScans: 189
  });

  // Données des analyses récentes
  const [recentAnalyses, setRecentAnalyses] = useState([
    {
      id: 1,
      documentType: 'Titre Foncier',
      citizenName: 'M. Ibrahim Sarr',
      date: '2024-01-20',
      status: 'validated',
      confidence: 98.5,
      issues: [],
      riskLevel: 'low'
    },
    {
      id: 2,
      documentType: 'Permis de Construire',
      citizenName: 'Mme Aïcha Diop',
      date: '2024-01-20',
      status: 'fraud_detected',
      confidence: 87.2,
      issues: ['Signature suspecte', 'Tampon non conforme'],
      riskLevel: 'high'
    },
    {
      id: 3,
      documentType: 'Acte de Vente',
      citizenName: 'Entreprise Alpha Construction',
      date: '2024-01-19',
      status: 'pending',
      confidence: 72.3,
      issues: ['Vérification croisée requise'],
      riskLevel: 'medium'
    },
    {
      id: 4,
      documentType: 'Certificat d\'Urbanisme',
      citizenName: 'M. Ousmane Fall',
      date: '2024-01-19',
      status: 'validated',
      confidence: 94.7,
      issues: [],
      riskLevel: 'low'
    }
  ]);

  // Simulation du scan de document
  const handleDocumentScan = async () => {
    setScanningDocument(true);
    
    // Simulation d'analyse IA
    setTimeout(() => {
      const mockResult = {
        documentType: 'Titre Foncier',
        confidence: Math.random() * 30 + 70, // 70-100%
        fraudRisk: Math.random() * 100,
        issues: Math.random() > 0.7 ? ['Signature suspecte', 'Date incohérente'] : [],
        blockchain_verified: Math.random() > 0.5,
        authenticity_score: Math.random() * 20 + 80
      };
      
      setAnalysisResults(mockResult);
      setScanningDocument(false);
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'validated': return 'bg-green-100 text-green-800';
      case 'fraud_detected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const DocumentScanCard = ({ title, description, icon: Icon, onClick, disabled = false }) => (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`cursor-pointer ${disabled ? 'opacity-50' : ''}`}
      onClick={disabled ? undefined : onClick}
    >
      <Card className={`h-full transition-all duration-300 ${
        disabled ? '' : 'hover:shadow-lg border-l-4 border-l-teal-500'
      }`}>
        <CardContent className="p-6 text-center">
          <Icon className="h-12 w-12 text-teal-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header avec statistiques anti-fraude */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Documents Validés</p>
                  <p className="text-2xl font-bold text-green-900">{fraudStats.validDocuments}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Fraudes Détectées</p>
                  <p className="text-2xl font-bold text-red-900">{fraudStats.fraudsDetected}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Précision IA</p>
                  <p className="text-2xl font-bold text-blue-900">{fraudStats.accuracyRate}%</p>
                </div>
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">En Vérification</p>
                  <p className="text-2xl font-bold text-yellow-900">{fraudStats.pendingVerification}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Interface principale anti-fraude */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-teal-600" />
            <span>Système Anti-Fraude Municipal avec IA</span>
          </CardTitle>
          <CardDescription>
            Détection automatique des fraudes documentaires avec intelligence artificielle et blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="scanner">Scanner IA</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              <TabsTrigger value="analyses">Analyses</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
            </TabsList>

            {/* Scanner de documents avec IA */}
            <TabsContent value="scanner" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DocumentScanCard
                  title="Analyse Document"
                  description="Scanner et analyser un document avec IA"
                  icon={Scan}
                  onClick={handleDocumentScan}
                  disabled={scanningDocument}
                />
                
                <DocumentScanCard
                  title="Vérification Signature"
                  description="Analyse biométrique des signatures"
                  icon={FileCheck}
                  onClick={() => {}}
                />
                
                <DocumentScanCard
                  title="Contrôle Tampon"
                  description="Vérification authenticité des tampons"
                  icon={Award}
                  onClick={() => {}}
                />
              </div>

              {/* Zone de scan */}
              <div className="border-2 border-dashed border-teal-300 bg-teal-50 p-8 rounded-lg text-center">
                {scanningDocument ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    <Brain className="h-12 w-12 text-teal-600 mb-4" />
                  </motion.div>
                ) : (
                  <Upload className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                )}
                
                <h3 className="text-lg font-semibold text-teal-900 mb-2">
                  {scanningDocument ? 'Analyse IA en cours...' : 'Déposer un document'}
                </h3>
                <p className="text-teal-700 mb-4">
                  {scanningDocument ? 'Vérification avec blockchain et IA' : 'Glissez un document ou cliquez pour sélectionner'}
                </p>
                
                {scanningDocument && (
                  <div className="max-w-xs mx-auto">
                    <Progress value={65} className="mb-2" />
                    <p className="text-sm text-teal-600">Analyse en cours: 65%</p>
                  </div>
                )}
              </div>

              {/* Résultats d'analyse */}
              {analysisResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        <span>Analyse IA</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Confiance IA:</span>
                        <span className="font-semibold">{analysisResults.confidence.toFixed(1)}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Score Authenticité:</span>
                        <span className="font-semibold">{analysisResults.authenticity_score.toFixed(1)}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Risque Fraude:</span>
                        <Badge className={`${
                          analysisResults.fraudRisk < 30 ? 'bg-green-100 text-green-800' :
                          analysisResults.fraudRisk < 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {analysisResults.fraudRisk.toFixed(1)}%
                        </Badge>
                      </div>

                      {analysisResults.issues.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-sm font-medium text-red-600 mb-2">Problèmes détectés:</p>
                          {analysisResults.issues.map((issue, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-red-600">
                              <AlertTriangle className="h-4 w-4" />
                              <span>{issue}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Network className="h-5 w-5 text-purple-600" />
                        <span>Vérification Blockchain</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        {analysisResults.blockchain_verified ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-green-600 font-medium">Vérifié sur blockchain</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <span className="text-red-600 font-medium">Non trouvé sur blockchain</span>
                          </>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p>Hash: 0x7f9a8b2c3d4e5f6a7b8c9d0e1f2a3b4c</p>
                        <p>Block: #1,247,892</p>
                        <p>Timestamp: {new Date().toLocaleString('fr-FR')}</p>
                      </div>

                      <Button className="w-full" size="sm">
                        <Network className="h-4 w-4 mr-2" />
                        Voir sur Blockchain
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>

            {/* Vérification Blockchain */}
            <TabsContent value="blockchain" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-6 text-center">
                    <Network className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-purple-900 mb-2">Documents Blockchain</h3>
                    <p className="text-2xl font-bold text-purple-900">1,205</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-6 text-center">
                    <Lock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-green-900 mb-2">Sécurisés</h3>
                    <p className="text-2xl font-bold text-green-900">98.7%</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-6 text-center">
                    <Database className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-blue-900 mb-2">Transactions</h3>
                    <p className="text-2xl font-bold text-blue-900">2,341</p>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Network className="h-4 w-4" />
                <AlertTitle>Blockchain Municipal Teranga</AlertTitle>
                <AlertDescription>
                  Tous les documents officiels sont automatiquement sécurisés sur notre blockchain privée 
                  pour garantir leur authenticité et traçabilité.
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Analyses récentes */}
            <TabsContent value="analyses" className="space-y-6">
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <motion.div
                    key={analysis.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: analysis.id * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-teal-100 p-2 rounded-lg">
                              <FileText className="h-5 w-5 text-teal-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{analysis.documentType}</h4>
                              <p className="text-sm text-gray-600">{analysis.citizenName}</p>
                              <p className="text-xs text-gray-500">{new Date(analysis.date).toLocaleDateString('fr-FR')}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-sm font-medium">Confiance: {analysis.confidence}%</div>
                              <div className={`text-sm ${getRiskColor(analysis.riskLevel)}`}>
                                Risque: {analysis.riskLevel}
                              </div>
                            </div>
                            
                            <Badge className={getStatusColor(analysis.status)}>
                              {analysis.status === 'validated' ? 'Validé' :
                               analysis.status === 'fraud_detected' ? 'Fraude' : 'En attente'}
                            </Badge>
                          </div>
                        </div>

                        {analysis.issues.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex flex-wrap gap-2">
                              {analysis.issues.map((issue, index) => (
                                <Badge key={index} variant="outline" className="text-xs text-red-600 border-red-200">
                                  {issue}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Rapports */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Rapport Mensuel</h3>
                    <p className="text-sm text-gray-600 mb-4">Statistiques anti-fraude du mois</p>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Archive className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Archive Analyses</h3>
                    <p className="text-sm text-gray-600 mb-4">Historique complet des vérifications</p>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Consulter
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MairieAntiFraude;